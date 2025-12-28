import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { Header } from "@/components/layout/Header";
import Index from "./pages/Index";
import ChildHome from "./pages/ChildHome";
import GameHub from "./pages/GameHub";
import GamePlay from "./pages/GamePlay";
import AvatarEditor from "./pages/AvatarEditor";
import Shop from "./pages/Shop";
import MyRoom from "./pages/MyRoom";
import SavedLists from "./pages/SavedLists";
import NotFound from "./pages/NotFound";
import ParentPortal from "./pages/ParentPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/play" element={<ChildHome />} />
            <Route path="/parent" element={<ParentPortal />} />
            <Route path="/games" element={<GameHub />} />
            <Route path="/games/:mode" element={<GamePlay />} />
            <Route path="/avatar" element={<AvatarEditor />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/room" element={<MyRoom />} />
            <Route path="/saved-lists" element={<SavedLists />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
