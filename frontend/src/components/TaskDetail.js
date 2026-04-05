import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManageTasks from "./ManageTasks";
import "./TaskDetail.css";

function formatDateLabel(yyyyMmDd) {
	const date = new Date(yyyyMmDd + "T00:00:00");
	if (Number.isNaN(date.getTime())) return yyyyMmDd;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function useOutsideClick(refs, onOutside) {
	useEffect(() => {
		function onDocMouseDown(e) {
			const isInside = refs.some((r) => r.current && r.current.contains(e.target));
			if (!isInside) onOutside();
		}

		document.addEventListener("mousedown", onDocMouseDown);
		return () => document.removeEventListener("mousedown", onDocMouseDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onOutside, ...refs.map((r) => r.current)]);
}

function PriorityDropdownCard({ value, onChange }) {
	const [open, setOpen] = useState(false);
	const cardRef = useRef(null);
	const optionsRef = useRef(null);
	const priorityClass = "td-priority-" + String(value).toLowerCase();

	useOutsideClick([cardRef, optionsRef], () => setOpen(false));

	const options = useMemo(() => ["Low", "Medium", "High"], []);

	function pick(next) {
		onChange(next);
		setOpen(false);
	}

	return (
		<div className="td-cardWrap" ref={cardRef}>
			<button
				type="button"
				className="td-card td-cardButton"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				<div className="td-cardTop">
					<span className="td-cardLabel">Priority</span>
					<span className="td-caret" aria-hidden="true">
						v
					</span>
				</div>
				<div className={"td-cardValue " + priorityClass}>{value}</div>
			</button>

			{open && (
				<div className="td-popover" ref={optionsRef} role="listbox" aria-label="Priority">
					{options.map((opt) => (
						<button
							key={opt}
							type="button"
							className={"td-optionBtn" + (opt === value ? " td-optionBtnSelected" : "")}
							onClick={() => pick(opt)}
							role="option"
							aria-selected={opt === value}
						>
							{opt}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function DateDropdownCard({ value, onChange }) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState(value);
	const cardRef = useRef(null);
	const popRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => setDraft(value), [value]);

	useOutsideClick([cardRef, popRef], () => setOpen(false));

	useEffect(() => {
		if (!open) return;
		// Native date picker (Chrome/Edge) if supported
		const t = window.setTimeout(() => inputRef.current?.showPicker?.(), 0);
		return () => window.clearTimeout(t);
	}, [open]);

	const label = useMemo(() => formatDateLabel(value), [value]);

	function apply() {
		onChange(draft);
		setOpen(false);
	}

	return (
		<div className="td-cardWrap" ref={cardRef}>
			<button
				type="button"
				className="td-card td-cardButton"
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				<div className="td-cardTop">
					<span className="td-cardLabel">Date</span>
					<span className="td-caret" aria-hidden="true">
						v
					</span>
				</div>
				<div className="td-cardValue">{label}</div>
			</button>

			{open && (
				<div className="td-popover td-popoverDate" ref={popRef}>
					<label className="td-popoverLabel">
						Choose date
						<input
							ref={inputRef}
							className="td-dateInput"
							type="date"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
						/>
					</label>
					<div className="td-popoverActions">
						<button type="button" className="td-actionBtn td-actionBtnGhost" onClick={() => setOpen(false)}>
							Cancel
						</button>
						<button type="button" className="td-actionBtn" onClick={apply}>
							Apply
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default function TaskDetail() {
	const navigate = useNavigate();
	useParams(); // keep route param available for future data wiring

	const [open, setOpen] = useState(false);
	const [priority, setPriority] = useState("Medium");

	const defaultYmd = useMemo(() => {
		const d = new Date();
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}, []);

	const [dateYmd, setDateYmd] = useState(defaultYmd);

	useEffect(() => {
		// Start open on mount for the slide-in animation
		setOpen(true);
	}, []);

	function close() {
		setOpen(false);
		// Wait for animation to finish before navigating away
		window.setTimeout(() => navigate("/tasks"), 220);
	}

	return (
		<div className="td-root">
			<div className="td-desktop">
				<ManageTasks />
			</div>

			<div className={"td-overlay" + (open ? " td-overlayOpen" : "")} onClick={close} />

			<aside className={"td-drawer" + (open ? " td-drawerOpen" : "")} aria-label="Task detail drawer">
				<div className="td-drawerHeader">
					<div>
						<div className="td-drawerKicker">Task</div>
						<h2 className="td-drawerTitle">Task details</h2>
					</div>
					<button type="button" className="td-closeBtn" onClick={close} aria-label="Close task details">
						X
					</button>
				</div>

				<div className="td-drawerBody">
					<div className="td-grid">
						<PriorityDropdownCard value={priority} onChange={setPriority} />
						<DateDropdownCard value={dateYmd} onChange={setDateYmd} />
					</div>

					<div className="td-section">
						<div className="td-sectionTitle">Details</div>
						<div className="td-placeholder">
							{/* You can wire real task data into this section later */}
							This panel is ready for your Figma layout. Hook up task fields (title, notes, assignees, etc.) next.
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}
