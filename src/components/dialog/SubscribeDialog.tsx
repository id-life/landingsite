type SubscribeDialogProps = {
  handleSubmit?: () => void;
};
export default function SubscribeDialog({ handleSubmit }: SubscribeDialogProps) {
  return (
    <div className="w-[27.5rem] p-8 mobile:w-full">
      <img src="/svgs/email.svg" className="mx-auto h-10" alt="email" />
      <h3 className="text-xl/5.5 mt-4 text-center font-semibold uppercase">subscribe</h3>
      <form
        className="mt-8 px-2"
        action="https://life.us11.list-manage.com/subscribe/post?u=e6f88de977cf62de3628d944e&amp;id=af9154d6b5&amp;f_id=00e418e1f0"
        method="post"
        target="_blank"
        onSubmit={() => handleSubmit?.()}
      >
        <div className="border-2 border-gray-800 p-3">
          <input
            className="w-full text-sm font-semibold"
            placeholder="Please enter email"
            type="email"
            name="EMAIL"
            required
            defaultValue=""
          />
        </div>
        <div className="submit-btn mt-7.5 !py-0">
          <input className="relative z-10 w-full cursor-pointer py-3" type="submit" value="Subscribe" />
        </div>
      </form>
    </div>
  );
}
