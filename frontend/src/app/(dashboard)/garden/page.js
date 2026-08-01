"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function slugify(name) {
  return name.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-");
}

export default function GardenPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => { setPlants(Array.isArray(data) ? data : []); setFetching(false); })
        .catch(() => setFetching(false));
    }
  }, [token]);

  const handleRemove = async (e, plantId) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/garden/${plantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlants((prev) => prev.filter((p) => p._id !== plantId));
    } catch {
      alert("Could not remove plant");
    }
  };

  if (loading || !user) return <p className="p-10 text-muted">Loading...</p>;

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


    {/* botanical atmosphere */}

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
      max-w-6xl
      mx-auto
    ">



      {/* HEADER */}

      <div className="mb-8">


        <span className="
          inline-flex
          items-center
          gap-2
          bg-primary/10
          text-primary
          text-xs
          font-bold
          uppercase
          tracking-widest
          px-4
          py-1.5
          rounded-full
          mb-4
        ">
          Your Collection
        </span>



        <h1
          className="
            text-4xl
            font-bold
            text-primary
            mb-2
          "
          style={{
            fontFamily:"var(--font-display)"
          }}
        >
          My Garden
        </h1>


        <p className="
          text-muted
          max-w-xl
        ">
          Your saved medicinal and culinary plants. Build your personal
          botanical reference library.
        </p>


      </div>







      {fetching ? (

        <div className="
          bg-white
          rounded-3xl
          border border-primary/10
          p-8
          text-muted
        ">
          Loading your garden...
        </div>


      ) : plants.length === 0 ? (


        <div className="
          bg-white/80
          backdrop-blur-xl
          border-2
          border-dashed
          border-primary/20
          rounded-3xl
          p-16
          text-center
          shadow-[0_20px_60px_-30px_rgba(31,61,43,0.3)]
        ">


          <div className="
            w-20
            h-20
            rounded-3xl
            bg-sage/20
            flex
            items-center
            justify-center
            text-4xl
            mx-auto
            mb-5
          ">
            🌱
          </div>


          <h2
            className="
              text-xl
              font-bold
              text-primary
              mb-2
            "
            style={{
              fontFamily:"var(--font-display)"
            }}
          >
            Your garden is empty
          </h2>


          <p className="
            text-muted
            mb-6
          ">
            Save plants while exploring to build your personal collection.
          </p>



          <Link
            href="/explore"
            className="
              inline-flex
              bg-primary
              text-white
              rounded-full
              px-7
              py-3
              font-semibold
              hover:bg-primary-light
              transition
            "
          >
            Explore Plants →
          </Link>


        </div>



      ) : (


        <>


          {/* garden stats */}

          <div className="
            mb-6
            bg-white/70
            backdrop-blur-xl
            border border-primary/10
            rounded-3xl
            p-5
            flex
            items-center
            gap-4
            w-fit
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
              🌿
            </div>


            <div>

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
                {plants.length}
              </p>


              <p className="
                text-xs
                text-muted
              ">
                Saved plants
              </p>

            </div>

          </div>






          <div className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            gap-5
          ">


            {plants.map((plant)=>{


              const imagePath =
                `/images/plants/${slugify(plant.commonName)}.jpg`;


              return (

                <Link
                  key={plant._id}
                  href={`/plants/${plant._id}`}
                  className="
                    group
                    bg-white
                    border border-primary/10
                    rounded-3xl
                    overflow-hidden
                    hover:shadow-lg
                    hover:-translate-y-1
                    transition-all
                  "
                >



                  <div className="
                    h-36
                    bg-sage/20
                    relative
                    overflow-hidden
                  ">


                    <img
                      src={imagePath}
                      alt={plant.commonName}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-105
                        transition
                      "
                      onError={(e)=>{
                        e.currentTarget.style.display="none";
                      }}
                    />



                    <button
                      onClick={(e)=>handleRemove(e,plant._id)}
                      className="
                        absolute
                        top-3
                        right-3
                        w-8
                        h-8
                        rounded-full
                        bg-white/90
                        text-primary
                        shadow-sm
                        hover:bg-clay/10
                        transition
                      "
                      title="Remove from garden"
                    >
                      ×
                    </button>


                  </div>





                  <div className="p-4">


                    <p
                      className="
                        font-bold
                        text-primary
                        text-sm
                      "
                      style={{
                        fontFamily:"var(--font-display)"
                      }}
                    >
                      {plant.commonName}
                    </p>



                    {plant.hindiName && (

                      <p className="
                        text-xs
                        text-primary-light
                        font-medium
                        mt-1
                      ">
                        {plant.hindiName}
                      </p>

                    )}



                    <p className="
                      italic
                      text-muted
                      text-xs
                      mt-2
                    ">
                      {plant.botanicalName}
                    </p>


                  </div>



                </Link>

              );

            })}


          </div>


        </>

      )}


    </div>


  </main>
);

}