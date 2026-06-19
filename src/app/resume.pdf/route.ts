import { getPortfolioData } from "@/lib/sanity/queries";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const data = await getPortfolioData();
    const resumeUrl = data.socials.resumeUrl;
    if (!resumeUrl) {
      return new NextResponse("Resume not found", { status: 404 });
    }
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      return new NextResponse("Failed to fetch resume from CDN", {
        status: response.status,
      });
    }
    const friendlyFilename = "JITTO-JOSEPH-Software-Engineer.pdf";
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${friendlyFilename}"`,
      },
    });
  } catch (error) {
    console.error("Error serving resume proxy:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
