import {
  useEffect,
  useRef,
  useState,
} from 'react';

type Result = 'Win' | 'Draw' | 'Loss';

interface ImpactResultSelectProps {
  value: Result;
  onChange: (value: Result) => void;
}

const options: Result[] = [
  'Win',
  'Draw',
  'Loss',
];

export default function ImpactResultSelect({
  value,
  onChange,
}: ImpactResultSelectProps) {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);


  /* =====================================================
     CLOSE WHEN CLICKING OUTSIDE
     ===================================================== */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);


  /* =====================================================
     SELECT OPTION
     ===================================================== */

  function handleSelect(
    option: Result
  ) {
    onChange(option);
    setOpen(false);
  }


  return (
    <div
      className="impact-custom-select"
      ref={wrapperRef}
    >

      {/* =================================================
          TRIGGER
          ================================================= */}

      <button
        type="button"
        className={`impact-custom-select-trigger ${
          open ? 'is-open' : ''
        }`}
        onClick={() =>
          setOpen(
            (previous) => !previous
          )
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >

        <span>
          {value}
        </span>

        <svg
          className={`impact-select-chevron ${
            open ? 'rotate' : ''
          }`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

      </button>


      {/* =================================================
          MENU
          ================================================= */}

      {open && (
        <div
          className="impact-custom-select-menu"
          role="listbox"
          aria-label="Match result"
        >

          {options.map(
            (option) => {
              const selected =
                option === value;

              return (
                <button
                  key={option}
                  type="button"
                  className={`impact-custom-select-option ${
                    selected
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    handleSelect(option)
                  }
                  role="option"
                  aria-selected={
                    selected
                  }
                >

                  <span>
                    {option}
                  </span>

                  {selected && (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}

                </button>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}