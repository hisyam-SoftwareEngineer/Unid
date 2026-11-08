import { redirect } from 'next/navigation';

export default function Home() {
  // Langsung arahkan (redirect) pengunjung ke halaman POS
  redirect('/dashboard/pos');
}