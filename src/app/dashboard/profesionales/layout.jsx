import { redirect } from "next/navigation";
import { getDashboardRole } from "@/lib/getDashboardRole";

export default async function ProfesionalesLayout({ children }) {
    const role = await getDashboardRole();

    if (role === "basico") {
        redirect("/dashboard/no-access");
    }

    return children;
}
