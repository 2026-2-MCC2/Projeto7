import FormContato from '../components/FormContato';

export default function Contato() {
  return (
    <section className="contact-section">
      <div className="section-header">
        <span className="eyebrow">Formulário com validação</span>
        <h2>Fale com a equipe</h2>
      </div>
      <FormContato />
    </section>
  );
}