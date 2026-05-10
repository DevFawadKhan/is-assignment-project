import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Return a 200 response
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );

    // Expire the token immediately to delete the browser cookie
    response.cookies.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
