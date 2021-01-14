

export default function ContainerPage({children}){


    return (
        <div class="container mx-auto h-4/5 px-4 ">
            <div class="flex flex-wrap flex-col justify-center h-full w-full">
                {children}
            </div>
        </div>
    )
}

export function ContainerPageRow({children}){


    return (
        <div class="container mx-auto h-full px-4">
            <div class="flex flex-wrap flex-row  justify-center w-full">
                {children}
            </div>
        </div>
    )
}