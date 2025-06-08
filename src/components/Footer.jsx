import LanguageSelector from "./LanguageSelector";

export default function Footer() {
    return (
        <div className="flex justify-between bg-gradient-to-b from-blue-50 to-blue-100 rounded-b-lg px-4 py-2 border-t border-blue-200 ">
            <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
                <a href="#" className="hover:underline">
                    Declaração de privacidade
                </a>
                |
                <a href="#" className="hover:underline">
                    Termos de uso
                </a>
                |
                <a href="#" className="hover:underline">
                    Status do serviço
                </a>
            </div>

            <div className="flex">
                <LanguageSelector />
            </div>
        </div>
    )
}