import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Router from "next/router";
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import ActionButton from "@/components/ActionButton";
import { User } from "@prisma/client";
import { BiErrorAlt, BiHide, BiShow } from "react-icons/bi";
import { BsFillExclamationTriangleFill, BsFillTrashFill } from "react-icons/bs";
import { AuthStatus } from "@/types/next-auth";
import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import { UserData } from "@/types/prisma";
import { AGES, GENDERS, MAX_DISTANCE, POLY } from "@/globals/constants";
import { Button } from "@material-tailwind/react";

const EnableStatus = ["enabled", "updating", "disabled"] as const;
type EnableStatus = (typeof EnableStatus)[number];

interface ChildProps {
	status: AuthStatus;
	form: User | null;
	setForm: Dispatch<SetStateAction<User | null | "unset">>;
	isLoading: boolean;
	enableStatus: EnableStatus;
	setEnableStatus: Dispatch<SetStateAction<EnableStatus>>;
}

const Notice: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div className="my-8 text-2xl font-extrabold text-yellow-500">
			<BsFillExclamationTriangleFill className="inline mr-2 w-6 h-6" />
			{children}
		</div>
	);
};

const FormActions: FC<ChildProps> = ({
	form,
	setForm,
	setEnableStatus,
	enableStatus,
}) => {
	if (form)
		return (
			<div>
				<h3>Actions</h3>
				<div>
					<ActionButton
						disabled={enableStatus == "updating"}
						text={
							enableStatus == "updating"
								? `${form.enabled ? "Disabling" : "Enabling"} Form...`
								: `${enableStatus == "enabled" ? "Disable" : "Enable"} Form`
						}
						className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
						onClick={async () => {
							setEnableStatus("updating");
							await fetch("/api/responses/@me/enable", {
								method: "PATCH",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(!form.enabled),
							});
							setEnableStatus(!form.enabled ? "enabled" : "disabled");
							setForm({ ...form, enabled: !form.enabled });
						}}
					>
						{form.enabled ? (
							<BiHide className="w-full h-full" />
						) : (
							<BiShow className="w-full h-full" />
						)}
					</ActionButton>
					<ActionButton
						text="Delete Form"
						className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
						onClick={async () => {
							await fetch("/api/responses/@me", {
								method: "DELETE",
							});
							setForm("unset");
						}}
					>
						<BsFillTrashFill className="w-full h-full" />
					</ActionButton>
				</div>
				<hr className="my-2" />
			</div>
		);
	return null;
};

const FORM_INIT: UserData = {
	age: NaN,
	desc: "",
	gender: "",
	location: "",
	matchDesc: "",
	name: "",
	preferredAges: [],
	preferredGenders: [],
	radius: 0,
	selfieURL: null,
	poly: "",
};

interface QuestionProps {
	question: string;
	children?: ReactNode;
	name: string;
}

interface ChoiceProps extends QuestionProps {
	choices: readonly any[];
}

interface TextProps extends QuestionProps {
	placeholder: string;
	maxLength: number;
}

interface SliderProps extends QuestionProps {
	min: number;
	max: number;
	step?: number;
}

const ShortAnswer: FC<TextProps> = ({
	placeholder,
	children,
	name,
	question,
	maxLength,
}) => {
	return (
		<div>
			<label>{question}</label>
			{children && <div>{children}</div>}
			<Field
				id={name}
				name={name}
				placeholder={placeholder}
				maxLength={maxLength}
			/>
			<ErrorMessage name={name} />
		</div>
	);
};

const MultipleChoice: FC<ChoiceProps> = ({
	question,
	children,
	name,
	choices,
}) => {
	return (
		<div>
			<label>{question}</label>
			{children && <div>{children}</div>}
			<div className="flex flex-wrap justify-around items-center">
				{choices.map((choice) => {
					return (
						<Button className="m-1 rounded-md bg-slate-600" key={choice}>
							<label className="choice-wrapper">
								<Field type="radio" name={name} value={String(choice)} />
								{choice}
							</label>
						</Button>
					);
				})}
			</div>
			<ErrorMessage name={name} />
		</div>
	);
};

const SelectAnswer: FC<ChoiceProps> = ({
	question,
	children,
	name,
	choices,
}) => {
	return (
		<div>
			<label>{question}</label>

			{children && <div>{children}</div>}
			<div className="flex flex-wrap justify-around items-center">
				{choices.map((choice) => {
					return (
						<Button className="m-1 rounded-md bg-slate-600" key={choice}>
							<label className="choice-wrapper">
								<Field type="checkbox" name={name} value={String(choice)} />
								{choice}
							</label>
						</Button>
					);
				})}
			</div>
			<ErrorMessage name={name} />
		</div>
	);
};

const LongAnswer: FC<TextProps> = ({
	placeholder,
	children,
	name,
	question,
	maxLength,
}) => {
	return (
		<div>
			<label>{question}</label>
			{children && <div>{children}</div>}
			<Field
				id={name}
				name={name}
				placeholder={placeholder}
				as="textarea"
				className="h-80 text-black min-h-[100px]"
				maxLength={maxLength}
			/>
			<ErrorMessage name={name} />
		</div>
	);
};

interface UploadProps extends QuestionProps {
	accept: string;
}

const FileUpload: FC<UploadProps> = ({ question, children, name, accept }) => {
	const [field, meta, helpers] = useField<string | null>(name);

	const [uploading, setUploading] = useState(false);

	const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const elm = event.currentTarget;
		const file = elm.files?.[0];

		if (!file) return;

		setUploading(true);

		const formData = new FormData();
		formData.append("source", file);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		if (res.status !== 200) {
			helpers.setError("Upload failed. You may have uploaded an invalid file.");
		} else {
			helpers.setError(undefined);
			const value = await res.json();
			console.log(value);
			helpers.setValue(value.image.url);
		}

		elm.value = "";
		setUploading(false);
	};

	return (
		<div>
			<label>{question}</label>
			{children && (
				<div>
					{children}
					<br />
					{field.value && "Upload a new file to replace the old one."}
				</div>
			)}
			<input
				type="file"
				id={name}
				onChange={handleChange}
				accept={accept}
				className={uploading ? "hidden" : "block"}
			/>
			{uploading && <div>Uploading...</div>}
			{field.value && (
				<div>
					<label>Current image:</label>
					<img
						src={field.value}
						className="my-2 border-4 border-rose-900 max-h-[90vh]"
					/>
					<Button
						className="p-2 bg-red-500 rounded-full"
						onClick={() => {
							helpers.setValue(null);
						}}
					>
						Delete Image
					</Button>
				</div>
			)}

			{meta.error && (
				<div className="flex flex-wrap items-center my-4 text-3xl font-extrabold text-red-600 bg-purple-400 bg-opacity-20">
					<BiErrorAlt className="inline w-8 h-8" /> {meta.error}
				</div>
			)}
		</div>
	);
};

const Slider: FC<SliderProps> = ({
	question,
	children,
	name,
	max,
	min,
	step,
}) => {
	return (
		<div>
			<label>{question}</label>

			{children && <div>{children}</div>}
			<div className="flex justify-around items-center">
				{min}km
				<Field
					type="range"
					name={name}
					min={min}
					max={max}
					step={step}
					className="px-0 mx-4"
				/>
				{max}km
				<br />
			</div>
			<Field type="number" name={name} min={min} max={max} step={step} />
			<ErrorMessage name={name} />
		</div>
	);
};

const FormEdit: FC<ChildProps> = ({ form }) => {
	return (
		<div>
			<h3>{form ? "Edit" : "Create"} Form</h3>
			<Formik
				initialValues={
					form
						? {
							...form,
							preferredAges: (form.preferredAges as any[]).map((age) =>
								String(age)
							),
							age: String(form.age),
						}
						: FORM_INIT
				}
				validate={(values) => {
					const errors: { [key: string]: ReactNode } = {};
					if (!values.name?.length) {
						errors.name = "Your name is required.";
					} else if (values.name.length > 500) {
						errors.name = "Your name is too long.";
					}
					if (!values.age) {
						errors.age = "Your age is required.";
					}
					if (!(values.preferredAges as any[])?.length) {
						errors.preferredAges = "You must select at least one age.";
					}

					//TODO: Add pedo detection

					if (!values.gender) {
						errors.gender = "Your gender is required.";
					}

					if (!(values.preferredGenders as any[])?.length) {
						errors.preferredGenders = "You must select at least one gender.";
					}

					if (!values.location?.length) {
						errors.location = "Your location is required.";
					} else if (values.location.length > 500) {
						errors.location = "Location is too long.";
					}

					if (values.radius < 0 || values.radius > MAX_DISTANCE) {
						errors.radius = "Invalid distance.";
					}

					if (!values.poly) {
						errors.poly = "Your poly status is required.";
					}

					if (!values.desc?.length) {
						errors.desc = "Your description is required.";
					} else if (values.desc.length > 4000) {
						errors.desc = "Description is too long.";
					}

					if (!values.matchDesc?.length) {
						errors.matchDesc = "Your ideal partner description is required.";
					} else if (values.matchDesc.length > 4000) {
						errors.matchDesc = "Location is too long.";
					}

					for (let error in errors) {
						errors[error] = (
							<div className="flex flex-wrap items-center my-4 text-3xl font-extrabold text-red-600 bg-purple-400 bg-opacity-20">
								<BiErrorAlt className="inline w-8 h-8" /> {errors[error]}
							</div>
						);
					}
					return errors;
				}}
				onSubmit={() => { }}
			>
				<Form>
					<ShortAnswer
						maxLength={500}
						question="Name:"
						name="name"
						placeholder="Your name here"
					>
						The name you want to be addressed by
					</ShortAnswer>

					<MultipleChoice question="Age:" name="age" choices={AGES} />

					<SelectAnswer
						question="Ages you can date:"
						name="preferredAges"
						choices={AGES}
					/>

					<Notice>
						Notice: For the next two questions, cis refers to same gender as
						birth sex. AMAB refers to "a male at birth", while AFAB refers to "a
						female at birth".
					</Notice>

					<MultipleChoice question="Gender:" name="gender" choices={GENDERS} />

					<SelectAnswer
						question="Genders you can date:"
						name="preferredGenders"
						choices={GENDERS}
					/>

					<MultipleChoice question="Poly status" name="poly" choices={POLY}>
						Mono means you ONLY want one partner. Poly means you ONLY want
						multiple partners. Ambi means you can tolerate both, depending on
						who you are dating and their status.
					</MultipleChoice>

					<Notice>
						Notice: I cannot stress this enough, but for the next question,
						people love to put invalid answers, when it's one of the important
						parts of the form. Please read the instructions, because it helps
						everyone and our matchmakers.
					</Notice>

					<ShortAnswer
						question="Location (Please read instructions):"
						name="location"
						maxLength={500}
						placeholder="A location"
					>
						- Share your real-life location in the format
						[City/Town],[State/Province],[Country].
						<br />- If not comfortable, choose a location within a 50km radius
						of your real location and use the same format. This will ensure your
						privacy, due to the massive area range.
						<br />
						Incorrect submissions will be deleted as other users rely on this
						information.
					</ShortAnswer>
					<Slider
						min={0}
						max={MAX_DISTANCE}
						name="radius"
						question="Max radius for partners:"
					>
						Leave it at 0 if you want people from all around the world.
					</Slider>

					<Notice>
						Notice: Some people just don't take this seriously, but at least try
						on this section. Describe your interests clearly unless you want
						some weirdo in your dms that don't suit you.
					</Notice>
					<LongAnswer
						placeholder="Some stuff about yourself:"
						question="Describe yourself"
						name="desc"
						maxLength={4000}
					>
						Be quite descriptive, or else you might get rejected :)
					</LongAnswer>
					<LongAnswer
						placeholder="Some stuff you expect from a date:"
						question="Describe an ideal partner"
						name="matchDesc"
						maxLength={4000}
					>
						Be descriptive otherwise no one will claim you because you are lazy
						to do this completely :)
					</LongAnswer>

					<Notice>
						The selfie is optional; don't stress about it too much. But if you
						posted a pic in the discord selfie channel, but are reluctant to do
						it here, I advise you delete the pic. It doesn't make a difference
						because creepy ppl can just go on the discord channel.
					</Notice>

					<FileUpload
						question="Selfie:"
						name="selfieURL"
						accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
					>
						Optional, but recommended for sucessful match.
					</FileUpload>
				</Form>
			</Formik>
		</div>
	);
};

const FormManagement: FC = () => {
	const { status } = useSession();
	const [form, setForm] = useState<User | null | "unset">("unset"); // [form, setForm
	const [enableStatus, setEnableStatus] = useState<EnableStatus>("updating");
	const [isLoading, setIsLoading] = useState(false); // [isLoading, setIsLoading

	if (!isLoading && form == "unset") {
		setIsLoading(true);
		fetch("/api/responses/@me")
			.then((res) => res.json())
			.then((val: User | null) => {
				setForm(val);
				if (val) setEnableStatus(val.enabled ? "enabled" : "disabled");
				setIsLoading(false);
			});
	}

	if (typeof window !== "undefined" && status === "unauthenticated")
		Router.push("/");
	return (
		<>
			<NextSeo
				title="Matchmaking - Form"
				description="Manage your matchmaking form and responses."
			/>
			<Layout>
				{status == "authenticated" && !isLoading && form !== "unset" && (
					<>
						<h1>Form Management</h1>
						<FormActions
							status={status}
							form={form}
							setForm={setForm}
							isLoading={isLoading}
							enableStatus={enableStatus}
							setEnableStatus={setEnableStatus}
						/>
						<FormEdit
							status={status}
							form={form}
							setForm={setForm}
							isLoading={isLoading}
							enableStatus={enableStatus}
							setEnableStatus={setEnableStatus}
						/>
					</>
				)}
			</Layout>
		</>
	);
};

export default FormManagement;
