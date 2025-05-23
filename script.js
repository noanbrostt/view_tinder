// ✅ Tornar Toast global
Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

// ✅ Tornar validarCampos global
function validarCampos(campos) {
    let erros = [];

    // Resetar erros anteriores
    campos.forEach((campo) => {
        campo.element.removeClass("input-error");
    });

    setTimeout(() => {
        campos.forEach((campo) => {
            let valor;

            if (campo.type === "custom") {
                if (!campo.isValid) {
                    erros.push(campo.message);
                    campo.element.addClass("input-error");
                }
                return;
            }

            if (
                campo.element.is("input") ||
                campo.element.is("textarea") ||
                campo.element.is("select")
            ) {
                valor = campo.element.val().trim();
            }

            if (campo.type === "exact" && valor.length !== campo.length) {
                erros.push(campo.message);
                campo.element.addClass("input-error");
            }

            if (campo.type === "min" && valor.length < campo.length) {
                erros.push(campo.message);
                campo.element.addClass("input-error");
            }

            if (campo.type === "required" && valor.length === 0) {
                erros.push(campo.message);
                campo.element.addClass("input-error");
            }
        });

        if (erros.length > 0) {
            erros.forEach((erro, index) => {
                setTimeout(() => {
                    Toast.fire({
                        icon: "error",
                        title: erro,
                    });
                }, index * 600);
            });
            return false;
        }
    
        return true;
    }, 10);

}

// 🔧 Remover borda de erro ao começar a digitar/selecionar
$(document).on("input change", ".input-error", function () {
    $(this).removeClass("input-error");
});

// ✅ Carregar o conteúdo da página
$(document).ready(function () {
    $("#conteudo").load("./views/validar.html");
});
