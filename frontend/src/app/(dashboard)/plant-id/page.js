"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

export default function PlantIdPage() {
  const { token } = useAuth();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();

    reader.onloadend = () => {
      const fullResult = reader.result;
      setImageBase64(fullResult.split(",")[1]);
      setImagePreview(fullResult);
      setResult(null);
    };

    reader.readAsDataURL(file);
  };

  const handleIdentify = async () => {
    if (!imageBase64) {
      setError("Please upload a photo first.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plant-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageBase64,
            mimeType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        // Log successful plant identification
        if (token) {
          logActivity(token, {
            type: "identified_plant",
            title: `Identified ${data.commonName}`,
            subtitle: `${data.confidence}% confidence`,
          });
        }

        setResult(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="
    min-h-screen
    bg-cream
    relative
    overflow-hidden
    px-5
    py-8
    lg:px-10
  ">

    {/* botanical background depth */}

    <div className="
      absolute
      -top-40
      -right-40
      w-[420px]
      h-[420px]
      rounded-full
      bg-sage/20
      blur-3xl
    "/>


    <div className="
      absolute
      bottom-0
      left-0
      w-[300px]
      h-[300px]
      rounded-full
      bg-gold/10
      blur-3xl
    "/>



    <div className="
      relative
      max-w-4xl
      mx-auto
    ">


      {/* HEADER */}

      <div className="
        mb-8
      ">

        <div className="
          flex
          items-center
          gap-3
          mb-3
        ">

          <div className="
            w-12
            h-12
            rounded-2xl
            bg-sage/25
            flex
            items-center
            justify-center
            text-xl
          ">
            🔍🌿
          </div>


          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-primary
              "
              style={{
                fontFamily:"var(--font-display)"
              }}
            >
              Plant Identification
            </h1>

            <p className="
              text-sm
              text-muted
            ">
              AI-powered plant recognition with botanical insights
            </p>

          </div>


        </div>


      </div>





      {/* UPLOAD CARD */}


      <div className="
        bg-white/80
        backdrop-blur-xl
        border border-primary/10
        rounded-3xl
        p-6
        mb-6
        shadow-[0_25px_70px_-30px_rgba(31,61,43,0.35)]
      ">


        {imagePreview ? (

          <img
            src={imagePreview}
            alt="Uploaded plant"
            className="
              w-full
              max-h-96
              object-cover
              rounded-3xl
              mb-5
            "
          />

        ) : (

          <div className="
            rounded-3xl
            border-2
            border-dashed
            border-primary/20
            bg-sage/10
            p-12
            text-center
            mb-5
          ">

            <div className="
              w-16
              h-16
              mx-auto
              rounded-2xl
              bg-sage/25
              flex
              items-center
              justify-center
              text-3xl
              mb-4
            ">
              🌱
            </div>


            <p className="
              text-primary
              font-medium
            ">
              Upload a plant photo
            </p>


            <p className="
              text-xs
              text-muted
              mt-1
            ">
              Clear leaves, flowers, or stems work best
            </p>

          </div>

        )}




        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="
            block
            w-full
            text-sm
            text-muted
            mb-5
          "
        />



        <button
          onClick={handleIdentify}
          disabled={loading}
          className="
            w-full
            bg-primary
            text-white
            rounded-full
            py-3
            font-semibold
            hover:bg-primary-light
            transition
            disabled:opacity-50
          "
        >

          {loading
            ? "Identifying plant..."
            : "Identify Plant 🌿"
          }

        </button>



        {error && (

          <p className="
            mt-3
            text-sm
            text-clay
          ">
            {error}
          </p>

        )}


      </div>







      {/* RESULT */}


      {result && (

        <div className="
          bg-white
          border border-primary/10
          rounded-3xl
          p-6
          shadow-[0_25px_70px_-30px_rgba(31,61,43,0.35)]
        ">


          <div className="
            flex
            justify-between
            gap-5
            mb-5
          ">


            <div>


              <h2
                className="
                  text-2xl
                  font-bold
                  text-primary
                "
                style={{
                  fontFamily:"var(--font-display)"
                }}
              >

                {result.commonName}

                {result.hindiName && (

                  <span className="
                    text-base
                    font-normal
                    text-muted
                  ">
                    {" "}· {result.hindiName}
                  </span>

                )}

              </h2>



              {result.botanicalName && (

                <p className="
                  italic
                  text-sm
                  text-muted
                  mt-1
                ">
                  {result.botanicalName}
                </p>

              )}



              <p className="
                text-xs
                text-muted
                mt-1
              ">
                {result.family}
              </p>


            </div>





            <div className="
              bg-sage/20
              rounded-2xl
              px-5
              py-3
              text-center
              h-fit
            ">

              <p
                className="
                  text-2xl
                  font-bold
                  text-primary
                "
                style={{
                  fontFamily:"var(--font-display)"
                }}
              >
                {result.confidence}%
              </p>


              <p className="
                text-[11px]
                text-muted
              ">
                AI match
              </p>


            </div>



          </div>





          <p className="
            text-sm
            text-muted
            leading-relaxed
            mb-6
          ">
            {result.description}
          </p>





          {result.generalCare && (

            <div className="
              grid
              grid-cols-3
              gap-3
              mb-6
            ">


              {[
                ["☀️","Sunlight",result.generalCare.sunlight],
                ["💧","Water",result.generalCare.water],
                ["🌱","Difficulty",result.generalCare.difficulty]
              ].map(([icon,label,value])=>(

                <div
                  key={label}
                  className="
                    bg-sage/10
                    rounded-2xl
                    p-4
                    text-center
                  "
                >

                  <div>{icon}</div>

                  <p className="
                    text-xs
                    text-muted
                    mt-2
                  ">
                    {label}
                  </p>


                  <p className="
                    text-sm
                    text-primary
                    font-medium
                    mt-1
                  ">
                    {value}
                  </p>


                </div>

              ))}


            </div>

          )}






          <p className="
            text-sm
            text-muted
            mb-5
          ">

            <span className="
              font-semibold
              text-primary
            ">
              Known uses:
            </span>{" "}

            {result.knownUses}

          </p>






          {result.inDatabase ? (

            <Link
              href={`/plants/${result.databasePlantId}`}
              className="
                inline-flex
                items-center
                bg-primary
                text-white
                rounded-full
                px-6
                py-3
                text-sm
                font-semibold
                hover:bg-primary-light
                transition
              "
            >
              ✓ View Full Plant Profile →
            </Link>


          ) : (

            <div className="
              bg-primary/5
              border border-primary/10
              rounded-2xl
              p-4
              text-xs
              text-muted
            ">

              This plant is not in our curated database yet. Showing general AI knowledge only.

            </div>

          )}



        </div>

      )}


    </div>

  </main>
);

}
