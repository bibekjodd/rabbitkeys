export default function loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-wrap bg-neutral-900/50">
      {new Array(1000).fill('nothing').map((_, i) => (
        <div key={i} className="grid h-10 w-10 border border-gray-700/10"></div>
      ))}
    </div>
  );
}
