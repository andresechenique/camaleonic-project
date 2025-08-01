import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/libs/mongodb";
export async function  POST(request: Request) {

    const {fullname, email, password} = await request.json()
    console.log(fullname, email, password)

    if(!password || password.length < 6) return NextResponse.json({
        message:"Password must be at least 6 characters"
    }, {
        status: 400
    })

    try {
        await connectDB()
        const userFound = await User.findOne({email})
        const hashedPassword = await bcrypt.hash(password, 12);
        
    if (userFound) return NextResponse.json({message: "Email already is registered"}, {status: 409})

        const user = new User( {email,fullname,password: hashedPassword})
    const savedUser = await user.save();
    return NextResponse.json({
        email:savedUser.email,
        fullname:savedUser.fullname,
        id: savedUser._id
    })
} catch (error) {
    console.log(error)
    if (error instanceof Error) {
        return NextResponse.json({message: error.message}, {status: 400})
    }
}
}