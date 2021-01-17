

export function ContainerFull({children}){


    return (
        <div className="min-h-screen flex py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full">
                {children}
            </div>
        </div>
    )
}



export  function ContainerPage({children}){

    return (
        <div class="container mx-auto px-4 max-w-5xl">
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
