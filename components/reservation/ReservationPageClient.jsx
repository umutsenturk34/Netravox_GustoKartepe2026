import ReservationForm from "@/components/reservation/ReservationForm";
import ReservationSidebar from "@/components/reservation/ReservationSidebar";

export default function ReservationPageClient({ company, galleryImage }) {
  return (
    <main className="min-h-screen bg-[var(--cream)] pt-10 pb-20">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12 xl:gap-16 items-start">
          <ReservationSidebar company={company} galleryImage={galleryImage} />
          <ReservationForm />
        </div>
      </div>
    </main>
  );
}
