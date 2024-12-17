export function TokenLaunchpad() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Solana Token Launchpad
      </h1>
      <Input type="text" placeholder="Name" />
      <Input type="text" placeholder="Symbol" />
      <Input type="text" placeholder="Image URL" />
      <Input type="text" placeholder="Initial Supply" />
      <button className="mt-4 p-2 bg-amber-600 active:bg-amber-700 text-white rounded">
        Create a token
      </button>
    </div>
  );
}

function Input({
  placeholder,
  type,
  className,
}: {
  placeholder: string;
  type: string;
  className?: string;
}) {
  return (
    <input
      className={
        `bg-zinc-900 text-white border border-transparent outline-none mb-2 p-2 rounded focus:outline-none focus:border focus:border-zinc-400` +
        (className ? ` ${className}` : "")
      }
      type={type}
      placeholder={placeholder}
    />
  );
}
