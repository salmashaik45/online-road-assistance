function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-on-surface-variant">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm font-semibold tracking-wide text-on-surface-variant">{message}</p>
    </div>
  );
}

export default Loader;
