export function TokenLaunchpad() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Solana Token Launchpad</h1>
      <input
        className="inputText mb-2 p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Name"
      />
      <input
        className="inputText mb-2 p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Symbol"
      />
      <input
        className="inputText mb-2 p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Image URL"
      />
      <input
        className="inputText mb-2 p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Initial Supply"
      />
      <button className="btn mt-4 p-2 bg-blue-500 text-white rounded">
        Create a token
      </button>
    </div>
  );
}
