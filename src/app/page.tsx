import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { WelcomeMessage } from "@/components/ui/WelcomeMessage";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <WelcomeMessage />
      </main>
      <Footer />
    </div>
  );
}