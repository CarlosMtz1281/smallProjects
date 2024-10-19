// Implementación de Trie para autocompletar
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    searchPrefix(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return null;
            }
            node = node.children[char];
        }
        return node;
    }

    autocomplete(prefix) {
        let node = this.searchPrefix(prefix);
        let results = [];

        if (node) {
            this.dfs(node, prefix, results);
        }

        return results;
    }

    dfs(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push(prefix);
        }

        for (let char in node.children) {
            this.dfs(node.children[char], prefix + char, results);
        }
    }
}

//navbar


function showSection(section) {
    const sections = ['similitud', 'patron', 'palindromo', 'autocomplete'];
    if(section === 'palindromo'){
        buscarPalindromo();
    }

    sections.forEach(sec => {
        document.getElementById(`section-${sec}`).classList.add('hidden');
    });
    document.getElementById(`section-${section}`).classList.remove('hidden');
}




let text1 = '';
let text2 = '';
let autocompleteTrie = new Trie();

// Leer archivos y mostrar el contenido en el textarea
document.getElementById('fileInput1').addEventListener('change', function(event) {
    console.log('fileInput1 change event triggered');
    let file = event.target.files[0];
    if (!file) {
        console.error('No file selected for fileInput1');
        return;
    }
    let reader = new FileReader();
    reader.onload = function() {
        console.log('FileReader onload event triggered for fileInput1');
        text1 = reader.result;
        document.getElementById('fileContent1').value = text1;
        autocompleteTrie = new Trie(); // Reiniciar el Trie
        text1.split(/\W+/).forEach(word => autocompleteTrie.insert(word)); // Insertar palabras en el Trie
    };
    reader.onerror = function() {
        console.error('FileReader error event triggered for fileInput1');
    };
    reader.readAsText(file);
    console.log('Archivo 1 leído');
});

document.getElementById('fileInput2').addEventListener('change', function(event) {
    console.log('fileInput2 change event triggered');
    let file = event.target.files[0];
    if (!file) {
        console.error('No file selected for fileInput2');
        return;
    }
    let reader = new FileReader();
    reader.onload = function() {
        console.log('FileReader onload event triggered for fileInput2');
        text2 = reader.result;
        document.getElementById('fileContent2').value = text2;
        document.getElementById('fileContent2').disabled = false; // Habilitar textarea para Similitud
    };
    reader.onerror = function() {
        console.error('FileReader error event triggered for fileInput2');
    };
    reader.readAsText(file);
});

// PUNTO 1 PATRON

// Función para resaltar coincidencias de manera segura en un textarea
// Función para resaltar coincidencias y mostrarlas en un div
function highlightMatches(text, matches, className, resultArea) {
    if (typeof text !== 'string') {
        console.error('Expected text to be a string, but got:', typeof text);
        return;
    }

    let highlightedText = '';
    let lastEnd = 0;

    matches.forEach(([start, end]) => {
        // Añadir el texto anterior a la coincidencia sin cambios
        highlightedText += text.substring(lastEnd, start);
        // Añadir la coincidencia resaltada con la clase CSS
        highlightedText += `<span class="${className}">${text.substring(start, end)}</span>`;
        lastEnd = end;
    });

    // Añadir el resto del texto
    highlightedText += text.substring(lastEnd);

    // Colocar el texto resaltado en el div
    resultArea.innerHTML = highlightedText;
}

// Algoritmo de Búsqueda (KMP) con resaltado
function buscarPatron() {
    const pattern = document.getElementById('patternInput').value;
    const text = document.getElementById('fileContent1').value;

    console.log('Buscando patrón:', pattern);
    console.log('Texto a buscar:', text);

    if (pattern) {
        const matches = KMP(text, pattern);
        highlightMatches(text, matches, 'highlight-yellow', document.getElementById('highlightedText'));
        console.log('Coincidencias encontradas:', matches.length);
        document.getElementById('patronTitle').textContent = "Resultado de búsqueda en Texto 1";
    } else {
        console.log('No se proporcionó un patrón para buscar');
    }
}

// Algoritmo KMP (simplificado)
function KMP(text, pattern) {
    console.log('Texto:', text);
    console.log('Patrón:', pattern);

    let n = text.length;
    let m = pattern.length;
    let lps = Array(m).fill(0);

    // Generar tabla LPS (Longest Prefix Suffix)
    let len = 0;
    let i = 1;
    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    // Buscar el patrón en el texto
    let matches = [];
    i = 0; // Índice para el texto
    let j = 0; // Índice para el patrón
    while (i < n) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }

        if (j === m) {
            matches.push([i - j, i]); // Guardar las posiciones de coincidencia
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return matches;
}

// PUNTO 2 LA SIMILITUD

// verificar que exista un segundo texto
const similarityBtn = document.getElementById('similarityBtn');
similarityBtn.addEventListener('click', function() {
    if (text2.trim() !== '' && text1.trim() !== '') {
        buscarSimilitud();
    } else {
        similarityBtn.disabled = true;
        console.log('No se encontraron dos textos para buscar similitud');
    }
});

document.getElementById('fileInput2').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (!file) {
        console.error('No file selected for fileInput2');
        return;
    }
    let reader = new FileReader();
    reader.onload = function() {
        text2 = reader.result;
        document.getElementById('fileContent2').value = text2;
        document.getElementById('fileContent2').disabled = false; // Habilitar textarea para Similitud
        similarityBtn.disabled = text2.trim() === ''; // Habilitar o deshabilitar el botón según el contenido
    };
    reader.onerror = function() {
        console.error('FileReader error event triggered for fileInput2');
    };
    reader.readAsText(file);
});


// Algoritmo de Similitud (LCS)
function buscarSimilitud() {
    console.log('Buscando similitud entre los textos');

    console.log('Texto 1:', text1);
    console.log('Texto 2:', text2);

    const lcsResults = LCS(text1, text2);
    const resultArea1 = document.getElementById('highlightedText1');
    const resultArea2 = document.getElementById('highlightedText2');
    clearHighlights(resultArea1);
    clearHighlights(resultArea2);

    // Mostrar texto completo en los divs
    resultArea1.innerHTML = text1;
    resultArea2.innerHTML = text2;

    // Resaltar las coincidencias LCS en los divs
    lcsResults.forEach(result => {
        highlightMatches(text1, [[result.start1, result.end1]], 'highlight-blue', resultArea1);
        highlightMatches(text2, [[result.start2, result.end2]], 'highlight-blue', resultArea2);
    });
}

// Algoritmo de Palíndromo (Manacher)
function buscarPalindromo() {
    console.log('Buscando palíndromo en el texto');
    const resultArea = document.getElementById('highlightedTextPal');
    clearHighlights(resultArea);

    const palindromo = Manacher(text1);
    highlightMatches(text1, [[palindromo.start, palindromo.end]], 'highlight-green', resultArea);
    console.log('Palíndromo encontrado:', text1.substring(palindromo.start, palindromo.end));
}

// Algoritmo LCS (simplificado)
function LCS(text1, text2) {
    let n = text1.length;
    let m = text2.length;
    let dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

    let maxLength = 0;
    let end1 = 0;
    let end2 = 0;
    let results = [];

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > maxLength) {
                    maxLength = dp[i][j];
                    end1 = i;
                    end2 = j;
                }
            }
        }
    }

    // Collect all LCS matches
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (dp[i][j] === maxLength) {
                results.push({
                    start1: i - maxLength,
                    end1: i,
                    start2: j - maxLength,
                    end2: j
                });
            }
        }
    }

    return results;
}

// Algoritmo Manacher (simplificado)
function Manacher(text) {
    let n = text.length;
    let t = '#';
    for (let i = 0; i < n; i++) {
        t += text[i] + '#';
    }
    n = t.length;

    let P = Array(n).fill(0);
    let C = 0, R = 0;
    let center = 0, maxLength = 0;

    for (let i = 1; i < n - 1; i++) {
        let mirror = 2 * C - i;

        if (R > i) {
            P[i] = Math.min(R - i, P[mirror]);
        }

        while (t[i + (P[i] + 1)] === t[i - (P[i] + 1)]) {
            P[i]++;
        }

        if (i + P[i] > R) {
            C = i;
            R = i + P[i];
        }

        if (P[i] > maxLength) {
            maxLength = P[i];
            center = i;
        }
    }

    let start = (center - maxLength) / 2;
    let end = start + maxLength;

    return { start: Math.floor(start), end: Math.floor(end) };
}

// Autocompletar
document.getElementById('autocompleteInput').addEventListener('input', function() {
    const query = this.value;
    const results = autocompleteTrie.autocomplete(query);
    const list = document.getElementById('autocomplete-list');
    list.innerHTML = '';

    results.forEach(word => {
        let item = document.createElement('div');
        item.textContent = word;
        item.addEventListener('click', () => {
            document.getElementById('autocompleteInput').value = word;
            list.innerHTML = '';
        });
        list.appendChild(item);
    });
});

// Limpiar resaltados
function clearHighlights(element) {
    element.innerHTML = '';
}