

export function ContainerFull({children}){


    return (
        <div  className="min-h-screen flex py-12 px-4 sm:px-6 lg:px-8">
            <div  className="flex flex-col w-full">
                {children}
            </div>
        </div>
    )
}

export  function ContainerPageAdmin({children}){

    return (
        <div  className="container mx-auto px-4 max-w-7xl">
            <div  className="flex flex-wrap flex-col justify-center h-full w-full">
                {children}
            </div>
        </div>
    )
}

export default function ContainerPage({children}){

    return (
        <div  className="container mx-auto px-4 max-w-5xl">
            <div  className="flex flex-wrap flex-col justify-center h-full w-full">
                {children}
            </div>
        </div>
    )
}

export function ContainerPageRow({children}){


    return (
        <div  className="container mx-auto h-full px-4">
            <div  className="flex flex-wrap flex-row  justify-center w-full">
                {children}
            </div>
        </div>
    )
}
