import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Garment } from "./Garment";

const today = new Date();

@Entity()
@ObjectType()
export class Outfit {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    userId: number;

    @Column()
    @Field()
    name: string;

    @ManyToOne(() => Garment, (garment) => garment.id, { nullable: true })
    @Field(() => Garment, { nullable: true })
    mainTop: Garment;

    @ManyToOne(() => Garment, (garment) => garment.id, { nullable: true })
    @Field(() => Garment, { nullable: true })
    subTop: Garment;

    @ManyToOne(() => Garment, (garment) => garment.id, { nullable: true })
    @Field(() => Garment, { nullable: true })
    bottom: Garment;

    @ManyToOne(() => Garment, (garment) => garment.id, { nullable: true })
    @Field(() => Garment, { nullable: true })
    shoe: Garment;

    @Column("int", { array: true, nullable: true })
    @Field(() => [Number], { nullable: true })
    outfitPlansIds: number[];

    @Column({ default: today })
    @Field()
    created_at: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    updated_at: Date;
}

@InputType()
export class OutfitInput {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    mainTopId: number;

    @Field({ nullable: true })
    subTopId: number;

    @Field({ nullable: true })
    bottomId: number;

    @Field({ nullable: true })
    shoeId: number;
}