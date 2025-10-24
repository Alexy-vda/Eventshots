import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord | EventShot",
  description: "Gérez vos événements et partagez vos photos avec EventShot",
  robots: {
    index: false, // Dashboard ne doit pas être indexé
    follow: false,
  },
};
