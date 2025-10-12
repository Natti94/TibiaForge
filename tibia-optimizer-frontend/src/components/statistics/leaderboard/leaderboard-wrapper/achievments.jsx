function Events() {
  const [slide, setSlide] = useState(0);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
}

const isProd = import.meta.env.PROD;

const assets = {};
