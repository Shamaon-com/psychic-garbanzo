

export default function ContainerFull({children}){


    return (
        <div class="container mx-auto h-full px-4">
            <div class="flex flex-wrap flex-col justify-center w-full">
                {children}
            </div>
        </div>
    )
}