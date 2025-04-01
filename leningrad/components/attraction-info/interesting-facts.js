import "./interesting-facts-style.css";

export default function InterestingFacts({ facts }) {
    // Разбиваем строку на массив фактов
    const factsArray = typeof facts === 'string'
        ? facts.split(';')
            .map(fact => fact.trim())
            .filter(fact => fact.length > 0)
        : [];
    return (
        <section className="facts-container">
            <div className="facts-title">Интересные факты</div>
            {factsArray.length > 0 ? (
                <ul className="facts-list">
                    {factsArray.map((fact, index) => (
                        <li className="list-item" key={index}>{fact}</li>
                    ))}
                </ul>
            ) : (
                <p>Нет интересных фактов для отображения</p>
            )}
        </section>
    );
}