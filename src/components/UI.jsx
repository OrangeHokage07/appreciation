import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "presi",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col">
        <div className="mt-10 ml-10" />
        <div className="w-full overflow-auto pointer-events-none flex justify-center" />
      </main>

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0  animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              SASWAT SHARMA:
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              Khidderpore Don
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">Presi</h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Bhai ka Bhai
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              Lafda Enjoyer
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              QT
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              SASWAT SHARMA:
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              Khidderpore Don
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">Presi</h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              Bhai ka Bhai
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              Lafda Enjoyer
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              QT
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
