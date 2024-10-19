import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    @Field()
    mainTopId: number;

    @Column()
    @Field()
    subTopId: number;

    @Column()
    @Field()
    bottomId: number;

    @Column()
    @Field()
    shoeId: number;

    @Column("int", { array: true, nullable: true })
    @Field(() => [Number], { nullable: true })
    outfitPlans: number[];

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

    @Field(() => [Number], { nullable: true })
    outfitPlans: number[];
}