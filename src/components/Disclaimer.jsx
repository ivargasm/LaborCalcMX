import { useStore } from '../store/useStore';

const Disclaimer = () => {
    const { isDark } = useStore();
    
    return (
    <section className="mt-6 p-6 rounded-lg shadow-md border" style={{backgroundColor: 'var(--card-code)', borderColor: 'var(--details)'}}>
        <h2 className="text-lg font-semibold mb-2" style={{color: 'var(--main-title)'}}>
            Importante
        </h2>
        <p className="text-sm" style={{color: 'var(--subtitle)'}}>
            Esta calculadora proporciona estimaciones basadas en los datos ingresados y las fórmulas de cálculo estándar.
            Los resultados son meramente informativos y no constituyen asesoría legal. Para casos específicos o disputas legales,
            recomendamos consultar con un profesional en derecho laboral. El creador de esta aplicación no se hace responsable
            por el uso que se dé a la información aquí proporcionada.
        </p>
    </section>
    );
};

export default Disclaimer;