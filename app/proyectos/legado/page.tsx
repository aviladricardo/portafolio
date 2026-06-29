import { Nunito } from "next/font/google";
import FamiliasBCPPage from "./LegadoPage";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Legado — BCP",
  description: "Ayuda a crecer lo que construyeron para ti.",
};

export default function Page() {
  return (
    <div className={nunito.variable}>
      <FamiliasBCPPage />
    </div>
  );
}
