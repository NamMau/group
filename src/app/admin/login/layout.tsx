export default function LoginLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        {children}
      </div>
    );
  }