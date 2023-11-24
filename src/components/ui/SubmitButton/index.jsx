import { motion } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.5
};

const SubmitButton = ({ ...props }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="bg-[#fcfcfc] fixed pb-7 bottom-0 w-[calc(100%-56px)] left-7">
        <button
          {...props}
          className={
            `[-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-4 px-4 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg bg-buttonSubmit text-white`
          }
        />
      </div>
    </motion.div>
  );
};

export default SubmitButton;
