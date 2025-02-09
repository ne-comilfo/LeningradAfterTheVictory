import "./interesting-facts-style.css"

export default function InterestingFacts({ facts }) {
    return(
        <section>
            <h2 className="facts-title">Интересные факты</h2>
            <ul className="facts-list">
                {facts.map((fact, index) => (
                    <li className="list-item" key={index}>{fact}</li>
                    ))}
            </ul>
        </section>
    )
}