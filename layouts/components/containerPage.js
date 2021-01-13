

export default function ContainerFull({children}){


    return (
        <div class="max-w-7xl mx-auto w-full h-full">
            <div class="flex flex-wrap flex-col justify-center h-full">
                {children}
            </div>
        </div>
    )
}