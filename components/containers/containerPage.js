export default function ContainerPage({children}){

    return (
        <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-wrap flex-col justify-center h-full w-full">
                {children}
            </div>
        </div>
    )
}