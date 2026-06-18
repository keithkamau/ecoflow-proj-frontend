import { useState, useRef } from 'react';
import { Upload, Scale, Image, X, CheckCircle, AlertCircle, PenLine } from 'lucide-react';
import { ButtonSpinner } from '../common/LoadingSpinner';

const MAX_FILES   = 4;
const MAX_SIZE_MB = 5;

const ProofUpload = ({ pickupId, onSubmit }) => {
  const [weight,     setWeight]     = useState('');
  const [signature,  setSignature]  = useState('');
  const [files,      setFiles]      = useState([]);
  const [previews,   setPreviews]   = useState([]);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const fileRef = useRef(null);

  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter(
      (f) => f.type.startsWith('image/') && f.size <= MAX_SIZE_MB * 1024 * 1024
    );
    const combined = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
    setErrors((p) => ({ ...p, files: '' }));
  };

  const removeFile = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((p)    => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e = {};
    if (!weight || parseFloat(weight) <= 0) e.weight = 'Enter a valid weight in kg';
    if (files.length === 0)                 e.files  = 'Upload at least one photo';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('weight', weight);
      if (signature.trim()) fd.append('signature', signature.trim());
      files.forEach((f) => fd.append('photos', f));
      await onSubmit?.(pickupId, fd);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className='card text-center py-8' data-testid='proof-upload'>
        <div className='w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3'>
          <CheckCircle size={24} className='text-primary' />
        </div>
        <h3 className='text-h5 mb-1' style={{ color: 'var(--color-primary)' }}>Proof Submitted!</h3>
        <p className='text-sm text-neutral-500'>Weight: <strong>{weight} kg</strong> recorded with {files.length} photo(s).</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='card space-y-4' data-testid='proof-upload' noValidate>
      <h3 className='text-h5'>Upload Proof of Pickup</h3>

      {/* Weight */}
      <div>
        <label className='label' htmlFor='proof-weight'>
          <Scale size={13} className='inline mr-1' />Verified Weight (kg)
        </label>
        <input
          id='proof-weight'
          type='number'
          min='0.1'
          step='0.1'
          placeholder='e.g. 48.5'
          value={weight}
          onChange={(e) => { setWeight(e.target.value); setErrors((p) => ({ ...p, weight: '' })); }}
          className={`input ${errors.weight ? 'input-error' : ''}`}
          aria-describedby={errors.weight ? 'weight-err' : undefined}
        />
        {errors.weight && (
          <p id='weight-err' className='error-text flex items-center gap-1'>
            <AlertCircle size={11} />{errors.weight}
          </p>
        )}
      </div>

      {/* Signature */}
      <div>
        <label className='label' htmlFor='proof-signature'>
          <PenLine size={13} className='inline mr-1' />Collector Signature
        </label>
        <input
          id='proof-signature'
          type='text'
          placeholder='Full name of collector'
          value={signature}
          onChange={(e) => { setSignature(e.target.value); setErrors((p) => ({ ...p, signature: '' })); }}
          className='input'
        />
      </div>

      {/* Drop zone */}
      <div>
        <label className='label'>
          <Image size={13} className='inline mr-1' />
          Photos ({files.length}/{MAX_FILES})
        </label>
        <div
          data-testid='drop-zone'
          onDragOver={(e)  => { e.preventDefault(); setDragOver(true);  }}
          onDragLeave={()  => setDragOver(false)}
          onDrop={(e)      => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={()      => fileRef.current?.click()}
          role='button'
          tabIndex={0}
          aria-label='Upload photos — click or drag and drop'
          onKeyDown={(e)   => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click(); }}
          className={[
            'border-2 border-dashed rounded-md p-5 text-center cursor-pointer transition-colors duration-150',
            dragOver    ? 'border-primary bg-primary-light'  : '',
            errors.files ? 'border-error bg-error-light'     : '',
            !dragOver && !errors.files ? 'border-neutral-300 hover:border-primary hover:bg-neutral-50' : '',
          ].join(' ')}
        >
          <Upload size={22} className={`mx-auto mb-2 ${dragOver ? 'text-primary' : 'text-neutral-400'}`} />
          <p className='text-sm text-neutral-500'>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Click to upload</span> or drag & drop
          </p>
          <p className='text-xs text-neutral-400 mt-1'>PNG, JPG up to {MAX_SIZE_MB} MB each</p>
        </div>
        <input
          ref={fileRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={(e) => addFiles(e.target.files)}
          aria-hidden='true'
        />
        {errors.files && (
          <p className='error-text flex items-center gap-1 mt-1'>
            <AlertCircle size={11} />{errors.files}
          </p>
        )}
      </div>

      {/* Thumbnails */}
      {previews.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
          {previews.map((src, idx) => (
            <div key={idx} className='relative group aspect-square'>
              <img
                src={src}
                alt={`Photo ${idx + 1}`}
                className='w-full h-full object-cover rounded-md border border-neutral-200'
              />
              <button
                type='button'
                onClick={() => removeFile(idx)}
                className='absolute top-1 right-1 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                aria-label={`Remove photo ${idx + 1}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type='submit' className='btn-primary w-full' disabled={submitting}>
        {submitting
          ? <><ButtonSpinner />Submitting…</>
          : <><CheckCircle size={15} />Submit Proof</>}
      </button>
    </form>
  );
};

export default ProofUpload;
