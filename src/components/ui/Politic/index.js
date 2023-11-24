const Politic = () => {
  return <div>
    <div className="py-7 px-3 border border-startBorder rounded-lg mb-2">
      <p className="text-center text-[10px]">
        Нажимая на кнопку, вы подтверждаете, что ознакомились с{" "}
        <a
          target="_blank"
          rel="noreferrer"
          className="text-buttonSubmit"
          href="https://msk.strana.com/agreement"
        >
          политикой обработки персональных данных{" "}
        </a>
        и даете{" "}
        <a
          className="text-buttonSubmit"
          target="_blank"
          rel="noreferrer"
          href="https://msk.strana.com/agreement?tab=accept"
        >
          согласие{" "}
        </a>
        на обработку персональных данных.
      </p>
    </div>
  </div>
}

export default Politic