interface PromptProps {

    executing: boolean;

}

export default function Prompt({

    executing,

}: PromptProps) {

    return (

        <div className="flex items-center gap-2">

            <span className="font-bold text-[#6FCF97]">

                vertex

            </span>

            <span className="text-[#A79B91]">

                @

            </span>

            <span className="font-bold text-[#D6A15F]">

                paper

            </span>

            <span className="text-[#A79B91]">

                :

            </span>

            <span className="text-[#58A6FF]">

                ~

            </span>

            <span
                className={
                    executing
                        ? "animate-pulse text-green-400"
                        : "text-white"
                }
            >
                $
            </span>

        </div>

    );

}