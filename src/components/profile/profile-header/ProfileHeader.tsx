import Button from "@/components/ui/Button"
import AvatarUpload from "./AvatarUpload"

export default function ProfileHeader() { 
    return (
        <div className="relative w-full h-80 bg-linear-to-r from-[#c3adb4] to-[#8f6f79] group mt-[-50px]" >
            <div className="absolute top-8 right-6 flex flex-col gap-3"> 
                <Button className="bg-chinese-black text-white-smoke">Upload header image</Button>
            </div>

            <div className="absolute left-10 top-1/2 -translate-y-1/2 group/avatar">
                <AvatarUpload className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-400/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>

                <Button className="bg-chinese-black text-white-smoke absolute bottom-9 right-9 opacity-0 group-hover/avatar:opacity-100">
                  Upload image
                </Button>

                </AvatarUpload>
            </div>

            <div className="absolute left-72 bottom-20 -translate-y-1/2">
                <div className="flex flex-col" >
                    <h1 className="text-3xl font-bold text-white bg-black inline-block px-3 py-2">
                    Jumana bakry
                    </h1>
                    <p className="text-silver font-bold bg-black inline-block w-35 px-3 py-2">Jumana bakry</p>
                </div>
                
                <div className="bg-black inline-block px-3 py-1 absolute -bottom-10">
                    <p className="text-silver font-bold">Cairo, Egypt</p>
                </div>
            </div>
        
        </div>

    ) 
}