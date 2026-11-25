import { useState } from 'react';
import { Film } from 'lucide-react';

interface SafeCinemaImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

export function SafeCinemaImage({
  src,
  alt,
  caption,
  className = '',
  aspectClass = 'aspect-video',
}: SafeCinemaImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <figure className={className}>
        <div
          className={`${aspectClass} w-full bg-[#0A1628] border border-[#1E355A] flex flex-col items-center justify-center p-6 text-center`}
        >
          <Film className="w-6 h-6 text-[#C5A66E] mb-3" aria-hidden="true" />
          <p className="font-editorial text-lg text-white">{alt}</p>
          <p className="text-xs text-[#BFC8D6] mt-1">
            Fotograma de referencia · ALETHEIA Consultores S.A.S.
          </p>
        </div>
        {caption && (
          <figcaption className="text-xs font-editorial italic text-[#5E6B7E] mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={className}>
      <div className={`${aspectClass} w-full overflow-hidden bg-[#0A1628]`}>
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="text-xs font-editorial italic text-[#5E6B7E] mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
