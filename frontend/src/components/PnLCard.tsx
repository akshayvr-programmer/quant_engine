type Props = {

    title:string;

    value:string;

}



export default function PnLCard(

    {

        title,

        value

    }:Props

){

return(

<div


className="

bg-zinc-900

rounded-2xl

border

border-zinc-800


p-6


"

>


<p className="text-zinc-400">

{title}

</p>



<h1

className="

mt-3

text-3xl

font-semibold

text-white


"

>

{value}

</h1>


</div>

)

}