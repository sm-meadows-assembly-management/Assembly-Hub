export default function Home() {
  return <main className="page">
    <nav className="nav"><div className="brand"><span className="brandMark">A</span><span>Assembly</span></div><a className="login" href="#login">Log in</a></nav>
    <section className="hero"><div className="heroBadge">🏠 Our community, together</div><h1>Children.<br/><span>Community.</span><br/>Fun.</h1><p>Assembly brings the children of our apartment community together to learn, celebrate, create, compete and have fun.</p><div className="actions"><a className="primary" href="#explore">Explore Assembly</a><a className="secondary" href="#about">About us</a></div></section>
    <section id="explore" className="cards"><article><div>📅</div><h2>Events</h2><p>Celebrations, games, competitions and community activities.</p></article><article><div>🎯</div><h2>Activities</h2><p>Fun things to learn, play, create and perform together.</p></article><article><div>🏆</div><h2>Achievements</h2><p>Celebrate the moments and accomplishments that make Assembly special.</p></article></section>
    <section id="about" className="about"><div><p className="eyebrow">ABOUT ASSEMBLY</p><h2>Small community. Big ideas.</h2></div><p>Assembly is a child-led apartment-community organization founded in 2023. This public site shares what Assembly is; member information and the private gallery stay behind login.</p></section>
    <footer>Assembly · Founded 2023</footer>
  </main>;
}
