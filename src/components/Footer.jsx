const Footer = () => {
  return (
    <footer className="w-full bg-black py-2 text-center mt-auto flex justify-between px-4 md:px-10">
      <p className="text-white text-sm">2025</p>
      <a
        href="https://www.maximilianopalomeque.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white text-sm hover:text-cyan-300 transition-colors cursor-pointer"
      >
        developed by maximiliano palomeque
      </a>
    </footer>
  );
};

export default Footer;
