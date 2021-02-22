export default function PageCard({children}){

    return (
        <div
           className="bg-white rounded-lg shadow py-10 px-20 overflow-auto"
          style={{ height: "94%" }}
        >
            {children}
        </div>
    )
}