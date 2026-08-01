"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logActivity } from "@/utils/logActivity";

const suggestions = [
  { icon: "🧘", text: "Best herbs for anxiety & stress?" },
  { icon: "🌱", text: "Easy medicinal plants for beginners" },
  { icon: "🛡️", text: "Top immunity-boosting herbs" },
  { icon: "🍳", text: "What can I use to garnish my food?" },
];

export default function AssistantPage() {
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSources, setLastSources] = useState([]);

  const bottomRef = useRef(null);
  const prefilled = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = searchParams.get("q");

    if (q && !prefilled.current) {
      prefilled.current = true;
      setInput(q);
    }
  }, [searchParams]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assistant/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Sorry, something went wrong.",
            sources: [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.answer,
            sources: data.sources,
          },
        ]);

        setLastSources(data.sources || []);

        if (token) {
          logActivity(token, {
            type: "asked_ai",
            title: text,
            subtitle: data.answer?.slice(0, 80),
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Could not connect to server.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setLastSources([]);
    setInput("");
  };

  return (
  <div className="min-h-screen bg-cream relative overflow-hidden p-4 lg:p-6">

    {/* Botanical ambient background */}
    <div className="
      absolute -top-40 -right-40
      w-[420px] h-[420px]
      rounded-full
      bg-sage/20
      blur-3xl
    " />

    <div className="
      absolute bottom-0 left-0
      w-[300px] h-[300px]
      rounded-full
      bg-gold/10
      blur-3xl
    " />


    <div className="
      relative
      h-[calc(100vh-2rem)]
      lg:h-[calc(100vh-3rem)]
      flex
      overflow-hidden
      rounded-3xl
      border border-primary/10
      bg-white/70
      backdrop-blur-xl
      shadow-[0_30px_80px_-25px_rgba(31,61,43,0.35)]
    ">


      {/* CHAT AREA */}

      <main className="
        flex-1
        flex
        flex-col
        max-w-4xl
        mx-auto
        w-full
        px-5
        lg:px-10
        py-7
        bg-gradient-to-b
        from-white
        to-cream/40
      ">


        {/* HEADER */}

        <div className="
          flex
          justify-between
          items-center
          mb-6
        ">


          <div className="flex items-center gap-3">

            <div className="
              w-12 h-12
              rounded-2xl
              bg-sage/25
              flex
              items-center
              justify-center
              text-xl
              shadow-inner
            ">
              🌿
            </div>


            <div>

              <h1
                className="
                text-2xl
                font-bold
                text-primary
                "
                style={{
                  fontFamily:"var(--font-display)"
                }}
              >
                Nature AI
              </h1>


              <p className="text-xs text-muted">
                Ayurvedic plant intelligence · grounded in your database
              </p>

            </div>

          </div>



          <button
            onClick={handleNewChat}
            className="
              px-4 py-2
              rounded-full
              text-xs
              font-semibold
              text-primary
              border border-primary/20
              bg-white/70
              hover:bg-primary/5
              transition
            "
          >
            + New Chat
          </button>


        </div>





        {/* CHAT SCROLL */}

        <div className="
  flex-1
  overflow-y-auto
  nature-scroll
  space-y-5
  py-4
  pr-2
">



          {messages.length === 0 && (

            <div className="mt-8">


              <div className="text-center mb-8">

                <div className="
                  mx-auto
                  w-20 h-20
                  rounded-3xl
                  bg-sage/20
                  flex
                  items-center
                  justify-center
                  text-4xl
                  mb-4
                ">
                  🌱
                </div>


                <h2
                  className="
                  text-xl
                  font-bold
                  text-primary
                  "
                  style={{
                    fontFamily:"var(--font-display)"
                  }}
                >
                  Explore the plant world
                </h2>


                <p className="text-sm text-muted mt-2">
                  Ask about medicinal uses, cultivation, or culinary ideas.
                </p>

              </div>





              <div className="
                grid
                sm:grid-cols-2
                gap-4
              ">


                {suggestions.map((s)=>(

                  <button
                    key={s.text}
                    onClick={()=>sendMessage(s.text)}
                    className="
                      group
                      relative
                      overflow-hidden
                      text-left
                      bg-white
                      border border-primary/10
                      rounded-3xl
                      p-5
                      shadow-[0_15px_40px_-25px_rgba(31,61,43,0.35)]
                      hover:shadow-lg
                      hover:-translate-y-1
                      transition
                    "
                  >

                    <div className="
                      absolute
                      right-0
                      top-0
                      w-24
                      h-24
                      bg-sage/20
                      rounded-bl-full
                    "/>


                    <div className="
                      relative
                      w-11 h-11
                      rounded-2xl
                      bg-sage/30
                      flex
                      items-center
                      justify-center
                      mb-3
                    ">
                      {s.icon}
                    </div>


                    <p className="
                      relative
                      text-sm
                      font-medium
                      text-primary
                    ">
                      {s.text}
                    </p>


                  </button>

                ))}


              </div>


            </div>

          )}






          {messages.map((msg,i)=>(

            <div
              key={i}
              className={`
                flex
                ${msg.role==="user"
                  ?"justify-end"
                  :"justify-start"
                }
              `}
            >


              <div
                className={`
                  max-w-[85%]
                  px-5 py-4
                  rounded-3xl
                  text-sm
                  leading-relaxed
                  whitespace-pre-line

                  ${
                    msg.role==="user"
                    ?
                    `
                    bg-primary
                    text-white
                    rounded-br-md
                    shadow-[0_15px_30px_-20px_rgba(31,61,43,0.8)]
                    `
                    :
                    `
                    bg-white
                    border border-primary/10
                    text-primary
                    rounded-bl-md
                    shadow-[0_15px_40px_-25px_rgba(31,61,43,0.35)]
                    `
                  }
                `}
              >


                {msg.role==="assistant" && (

                  <div className="
                    text-xs
                    font-semibold
                    text-sage
                    mb-2
                  ">
                    🌿 Nature AI
                  </div>

                )}


                {msg.text}



                {msg.sources?.length>0 && (

                  <div className="
                    mt-4
                    pt-3
                    border-t
                    border-primary/10
                    flex
                    flex-wrap
                    gap-2
                  ">


                    {msg.sources.map((s)=>(

                      <Link
                        key={s.id}
                        href={`/plants/${s.id}`}
                        className="
                          px-3
                          py-1.5
                          rounded-full
                          bg-sage/20
                          text-primary
                          text-xs
                          font-medium
                        "
                      >
                        🌱 {s.hindiName || s.name}
                      </Link>

                    ))}


                  </div>

                )}


              </div>


            </div>

          ))}





          {loading && (

            <div className="flex">

              <div className="
                bg-white
                border border-primary/10
                rounded-3xl
                px-5 py-4
                text-sm
                text-muted
                shadow-sm
              ">
                Searching plant knowledge...
              </div>

            </div>

          )}


          <div ref={bottomRef}/>


        </div>







        {/* COMPOSER */}


        <form
          onSubmit={(e)=>{
            e.preventDefault();
            sendMessage(input);
          }}
          className="
            mt-4
            flex
            gap-3
            p-2
            rounded-full
            bg-white/90
            backdrop-blur-xl
            border border-primary/20
            shadow-[0_20px_60px_-15px_rgba(31,61,43,0.35)]
          "
        >

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Ask about medicinal plants..."
            className="
              flex-1
              px-5
              bg-transparent
              outline-none
              text-sm
              text-primary
            "
          />


          <button
            disabled={loading}
            className="
              px-6
              rounded-full
              bg-primary
              text-white
              font-semibold
              hover:bg-primary-light
              transition
            "
          >
            Send
          </button>


        </form>



        <p className="
          text-[10px]
          text-muted
          text-center
          mt-3
        ">
          Educational information only — not a substitute for professional medical advice.
        </p>


      </main>







      {/* RIGHT EVIDENCE PANEL */}


      <aside className="
hidden
lg:block
w-80
bg-cream/70
border-l border-primary/10
p-6
overflow-y-auto
nature-scroll
">



        <div className="mb-6">

          <div className="
            w-10 h-10
            rounded-2xl
            bg-sage/25
            flex
            items-center
            justify-center
            mb-3
          ">
            🌿
          </div>


          <h2
            className="
              text-lg
              font-bold
              text-primary
            "
            style={{
              fontFamily:"var(--font-display)"
            }}
          >
            Plant Evidence
          </h2>


          <p className="text-xs text-muted mt-1">
            Retrieved from your botanical knowledge base.
          </p>


        </div>




        {lastSources.length===0 ? (

          <div className="
            bg-white
            rounded-2xl
            border border-primary/10
            p-4
            text-sm
            text-muted
          ">
            Ask a question to discover matched plants.
          </div>

        ):(

          <div className="space-y-4">

            {lastSources.map((s)=>(

              <Link
                key={s.id}
                href={`/plants/${s.id}`}
                className="
                  block
                  bg-white
                  rounded-2xl
                  border border-primary/10
                  p-4
                  shadow-[0_15px_35px_-25px_rgba(31,61,43,0.4)]
                  hover:-translate-y-1
                  hover:shadow-lg
                  transition
                "
              >

                <div className="
                  h-1
                  w-10
                  rounded-full
                  bg-gold
                  mb-3
                "/>


                <p className="
                  font-bold
                  text-primary
                  text-sm
                ">
                  🌱 {s.hindiName || s.name}
                </p>


                <p className="
                  text-xs
                  text-muted
                  mt-2
                ">
                  Match confidence:
                  {" "}
                  {Math.round((s.score||0)*100)}%
                </p>


              </Link>

            ))}

          </div>

        )}
            {/* HOW IT WORKS CARD */}

<div className="
  mt-8
  relative
  overflow-hidden
  rounded-3xl
  border border-primary/10
  bg-white
  p-5
  shadow-[0_15px_40px_-25px_rgba(31,61,43,0.35)]
">

  {/* subtle botanical accent */}
  <div className="
    absolute
    -right-8
    -top-8
    w-24
    h-24
    rounded-full
    bg-sage/20
  "/>


  <div className="relative">

    <div className="
      flex
      items-center
      gap-3
      mb-4
    ">

      <div className="
        w-9
        h-9
        rounded-xl
        bg-primary/10
        flex
        items-center
        justify-center
      ">
        🧠
      </div>


      <div>

        <h3
          className="
          text-sm
          font-bold
          text-primary
          "
          style={{
            fontFamily:"var(--font-display)"
          }}
        >
          How Nature AI works
        </h3>

        <p className="text-[11px] text-muted">
          Retrieval augmented generation
        </p>

      </div>

    </div>



    <div className="space-y-3">


      <div className="
        flex
        gap-3
        items-start
      ">

        <div className="
          mt-1
          w-5
          h-5
          rounded-full
          bg-sage/30
          text-primary
          text-[10px]
          flex
          items-center
          justify-center
          font-bold
        ">
          1
        </div>


        <p className="
          text-xs
          text-muted
          leading-relaxed
        ">
          Your question is converted into a meaning-based search query.
        </p>

      </div>




      <div className="
        flex
        gap-3
        items-start
      ">

        <div className="
          mt-1
          w-5
          h-5
          rounded-full
          bg-sage/30
          text-primary
          text-[10px]
          flex
          items-center
          justify-center
          font-bold
        ">
          2
        </div>


        <p className="
          text-xs
          text-muted
          leading-relaxed
        ">
          Relevant plants are retrieved from your verified database.
        </p>

      </div>





      <div className="
        flex
        gap-3
        items-start
      ">

        <div className="
          mt-1
          w-5
          h-5
          rounded-full
          bg-gold/20
          text-primary
          text-[10px]
          flex
          items-center
          justify-center
          font-bold
        ">
          3
        </div>


        <p className="
          text-xs
          text-muted
          leading-relaxed
        ">
          The AI generates an answer using those retrieved plant records.
        </p>

      </div>


    </div>



    <div className="
      mt-5
      rounded-2xl
      bg-primary/5
      border border-primary/10
      p-3
    ">

      <p className="
        text-[11px]
        text-primary
        font-semibold
      ">
        🌿 Grounded responses
      </p>

      <p className="
        text-[11px]
        text-muted
        mt-1
        leading-relaxed
      ">
        Responses are based on your plant knowledge base rather than unrestricted internet information.
      </p>

    </div>


  </div>

</div>



      </aside>


    </div>

  </div>
);

}
