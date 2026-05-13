import { useRef, useState } from 'react';
import useNotes from '../hooks/useNotes.js';

const SIZES = [
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' },
];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Notes() {
  const { text, images, setText, addImage, removeImage, setImageSize } =
    useNotes();
  const [draft, setDraft] = useState(text);
  const fileRef = useRef(null);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith('image/')
    );
    for (const file of files) {
      try {
        const url = await fileToDataUrl(file);
        addImage(url);
      } catch {
        // ignore unreadable files
      }
    }
  }

  return (
    <aside className="notes">
      <header className="notes__header">
        <span className="notes__eyebrow">Notes</span>
      </header>

      <textarea
        className="input notes__text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== text) setText(draft);
        }}
        placeholder="Anything you want to remember…"
      />

      <div className="notes__images">
        {images.map((img) => (
          <figure key={img.id} className={`notes-img notes-img--${img.size}`}>
            <img src={img.dataUrl} alt="" />
            <div className="notes-img__controls">
              <div className="notes-img__sizes">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={
                      'notes-img__size' +
                      (img.size === s.id ? ' notes-img__size--active' : '')
                    }
                    onClick={() => setImageSize(img.id, s.id)}
                    aria-label={`Size ${s.label}`}
                    title={`Size ${s.label}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="notes-img__remove"
                onClick={() => removeImage(img.id)}
                aria-label="Remove image"
                title="Remove"
              >
                ×
              </button>
            </div>
          </figure>
        ))}
      </div>

      <div className="notes__upload">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => fileRef.current?.click()}
        >
          + Add image
        </button>
      </div>
    </aside>
  );
}
