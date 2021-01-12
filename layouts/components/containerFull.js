

export default function ContainerFull({children}){


    return (
        <div className="min-h-screen flex py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full">
                {children}
            </div>
        </div>
    )
}