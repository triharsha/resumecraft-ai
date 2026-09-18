import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ConfirmDialog from "../ConfirmDialog";

/* ========================================
   Default Props
======================================== */

const createProps = (
  overrides = {}
) => ({
  open: true,

  title: "Delete resume?",

  description:
    "This action cannot be undone.",

  confirmLabel:
    "Delete",

  cancelLabel:
    "Cancel",

  tone:
    "danger",

  onConfirm:
    vi.fn(),

  onCancel:
    vi.fn(),

  ...overrides,
});

/* ========================================
   Setup
======================================== */

beforeEach(() => {
  vi.clearAllMocks();

  vi.stubGlobal(
    "requestAnimationFrame",
    (callback) => {
      callback();

      return 1;
    }
  );
});

/* ========================================
   Visibility
======================================== */

describe(
  "ConfirmDialog visibility",
  () => {
    it(
      "renders nothing when closed",
      () => {
        render(
          <ConfirmDialog
            {...createProps({
              open: false,
            })}
          />
        );

        expect(
          screen.queryByRole(
            "alertdialog"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "renders the dialog when open",
      () => {
        render(
          <ConfirmDialog
            {...createProps()}
          />
        );

        expect(
          screen.getByRole(
            "alertdialog"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders the title and description",
      () => {
        render(
          <ConfirmDialog
            {...createProps()}
          />
        );

        expect(
          screen.getByText(
            "Delete resume?"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "This action cannot be undone."
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "uses alertdialog accessibility attributes",
      () => {
        render(
          <ConfirmDialog
            {...createProps()}
          />
        );

        const dialog =
          screen.getByRole(
            "alertdialog"
          );

        expect(
          dialog
        ).toHaveAttribute(
          "aria-modal",
          "true"
        );

        expect(
          dialog
        ).toHaveAttribute(
          "aria-labelledby",
          "confirm-dialog-title"
        );

        expect(
          dialog
        ).toHaveAttribute(
          "aria-describedby",
          "confirm-dialog-description"
        );
      }
    );
  }
);

/* ========================================
   Labels
======================================== */

describe(
  "ConfirmDialog labels",
  () => {
    it(
      "uses the provided action labels",
      () => {
        render(
          <ConfirmDialog
            {...createProps({
              confirmLabel:
                "Remove Resume",

              cancelLabel:
                "Keep Resume",
            })}
          />
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Remove Resume",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Keep Resume",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "uses default labels when labels are omitted",
      () => {
        const props =
          createProps();

        delete props.confirmLabel;
        delete props.cancelLabel;

        render(
          <ConfirmDialog
            {...props}
          />
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Confirm",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Cancel",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders the accessible close button",
      () => {
        render(
          <ConfirmDialog
            {...createProps()}
          />
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Close confirmation dialog",
            }
          )
        ).toBeInTheDocument();
      }
    );
  }
);

/* ========================================
   Confirmation
======================================== */

describe(
  "ConfirmDialog confirmation",
  () => {
    it(
      "calls onConfirm when confirm is clicked",
      async () => {
        const user =
          userEvent.setup();

        const onConfirm =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onConfirm,
            })}
          />
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        expect(
          onConfirm
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "guards against rapid repeated confirmation",
      () => {
        const onConfirm =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onConfirm,
            })}
          />
        );

        const confirmButton =
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          );

        fireEvent.click(
          confirmButton
        );

        fireEvent.click(
          confirmButton
        );

        fireEvent.click(
          confirmButton
        );

        expect(
          onConfirm
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "allows confirmation again after the dialog closes and reopens",
      () => {
        const onConfirm =
          vi.fn();

        const props =
          createProps({
            onConfirm,
          });

        const {
          rerender,
        } = render(
          <ConfirmDialog
            {...props}
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        expect(
          onConfirm
        ).toHaveBeenCalledTimes(
          1
        );

        rerender(
          <ConfirmDialog
            {...props}
            open={false}
          />
        );

        rerender(
          <ConfirmDialog
            {...props}
            open
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        expect(
          onConfirm
        ).toHaveBeenCalledTimes(
          2
        );
      }
    );
  }
);

/* ========================================
   Cancellation
======================================== */

describe(
  "ConfirmDialog cancellation",
  () => {
    it(
      "calls onCancel from the cancel button",
      async () => {
        const user =
          userEvent.setup();

        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onCancel,
            })}
          />
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Cancel",
            }
          )
        );

        expect(
          onCancel
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "calls onCancel from the close button",
      async () => {
        const user =
          userEvent.setup();

        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onCancel,
            })}
          />
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Close confirmation dialog",
            }
          )
        );

        expect(
          onCancel
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "calls onCancel when Escape is pressed",
      () => {
        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onCancel,
            })}
          />
        );

        fireEvent.keyDown(
          document,
          {
            key:
              "Escape",
          }
        );

        expect(
          onCancel
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "does not respond to Escape while closed",
      () => {
        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              open: false,
              onCancel,
            })}
          />
        );

        fireEvent.keyDown(
          document,
          {
            key:
              "Escape",
          }
        );

        expect(
          onCancel
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "calls onCancel when the backdrop is clicked",
      () => {
        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onCancel,
            })}
          />
        );

        const dialog =
          screen.getByRole(
            "alertdialog"
          );

        const backdrop =
          dialog.parentElement;

        expect(
          backdrop
        ).toBeInTheDocument();

        expect(
          document.body.contains(
            backdrop
          )
        ).toBe(true);

        fireEvent.mouseDown(
          backdrop
        );

        expect(
          onCancel
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "does not cancel when the dialog itself is clicked",
      () => {
        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            {...createProps({
              onCancel,
            })}
          />
        );

        fireEvent.mouseDown(
          screen.getByRole(
            "alertdialog"
          )
        );

        expect(
          onCancel
        ).not.toHaveBeenCalled();
      }
    );
  }
);

/* ========================================
   Focus Management
======================================== */

describe(
  "ConfirmDialog focus management",
  () => {
    it(
      "focuses the cancel button when opened",
      async () => {
        render(
          <ConfirmDialog
            {...createProps()}
          />
        );

        const cancelButton =
          screen.getByRole(
            "button",
            {
              name:
                "Cancel",
            }
          );

        await waitFor(
          () => {
            expect(
              cancelButton
            ).toHaveFocus();
          }
        );
      }
    );

    it(
      "restores focus when the dialog closes",
      async () => {
        const previousButton =
          document.createElement(
            "button"
          );

        previousButton.textContent =
          "Previous action";

        document.body.appendChild(
          previousButton
        );

        previousButton.focus();

        expect(
          previousButton
        ).toHaveFocus();

        const props =
          createProps();

        const {
          rerender,
        } = render(
          <ConfirmDialog
            {...props}
          />
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "button",
                {
                  name:
                    "Cancel",
                }
              )
            ).toHaveFocus();
          }
        );

        rerender(
          <ConfirmDialog
            {...props}
            open={false}
          />
        );

        await waitFor(
          () => {
            expect(
              previousButton
            ).toHaveFocus();
          }
        );

        previousButton.remove();
      }
    );
  }
);

/* ========================================
   Tone
======================================== */

describe(
  "ConfirmDialog tone",
  () => {
    it(
      "uses danger styling by default",
      () => {
        const props =
          createProps();

        delete props.tone;

        render(
          <ConfirmDialog
            {...props}
          />
        );

        const button =
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          );

        expect(
          button.className
        ).toContain(
          "bg-rose-600"
        );
      }
    );

    it(
      "uses violet styling for non-danger confirmation",
      () => {
        render(
          <ConfirmDialog
            {...createProps({
              tone:
                "default",
            })}
          />
        );

        const button =
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          );

        expect(
          button.className
        ).toContain(
          "bg-violet-600"
        );
      }
    );
  }
);