import "./App.css";
import { useEffect } from "react";
import useTelegramInitData from "./hooks/useTelegramInitData";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import Main from "./components/pages/Main";
import Subscriptions from "./components/pages/Subscriptions";
import Reglament from "./components/pages/Reglament";
import NameSuccess from "./components/pages/NameSuccess";
import SelectionQuestion from "./components/pages/SelectionQuestion";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "./components/blocks/AuthProvider";
import ThanksPage from "./components/pages/ThanksPage";
import Collection from "./components/pages/Collection";
import Questions from "./components/pages/Questions";
// import Start from "./components/pages/Start";
import { motion } from "framer-motion";
import CollectionItem from "./components/pages/CollectionItem";
import { YMaps } from "@pbe/react-yandex-maps";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "linear",
  duration: 0.5,
};

const AnimationLayout = () => {
  const { pathname } = useLocation();
  return (
    <>
      <motion.div
        className="h-full"
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.div>
    </>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      refetchOnReconnect: false, // default: true
    },
  },
});

function App() {
  const { tg } = useTelegramInitData();

  useEffect(() => {
    tg.ready();
    tg.expand();
    // eslint-disable-next-line
  }, []);

  return (
    <YMaps>
      <QueryClientProvider client={queryClient}>
        <div className="relative m-7 mt-2 mb-0 h-14 shrink-0">
          <div className="shrink-0 bg-contain bg-center h-full w-full bg-[url('./assets/images/logo.svg')] bg-no-repeat" />
          <img className="hidden" src={"./assets/images/thank.svg"} />
          <div className="hidden bg-[url('./assets/images/thank.svg')]" />
        </div>
        <AuthProvider>
          <Routes>
            <Route element={<AnimationLayout />}>
              {/* <Route index element={<Start />} /> */}
              <Route index element={<Questions />} />
              <Route path={"main"} element={<Main />} />
              <Route path={"subscriptions"} element={<Subscriptions />} />
              <Route path={"reglament"} element={<Reglament />} />
              <Route path={"nameSuccess"} element={<NameSuccess />} />
              <Route
                path={"selectionQuestion"}
                element={<SelectionQuestion />}
              />
              <Route path={"thanksPage"} element={<ThanksPage />} />
              {/* <Route path={"questions"} element={<Questions />} /> */}
              <Route path={"collection"} element={<Collection />} />
              <Route path={"collectionItem"} element={<CollectionItem />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </YMaps>
  );
}

export default App;
