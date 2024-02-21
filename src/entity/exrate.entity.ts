import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'ExRate'})
export class ExRateEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({ name: 'created_at' })
    CreatedAt!: Date;

    @Column({type: 'decimal', precision: 10, scale: 5})
    AED?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    AUD?: number;
    
    @Column({type: 'decimal', precision: 10, scale: 5})
    BHD?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    CAD?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    CHF?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    CNH?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    DKK?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    EUR?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    GBP?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    HKD?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    IDR?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    JPY?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    KRW?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    KWD?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    MYR?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    NOK?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    NZD?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    SAR?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    SEK?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    SGD?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    THB?: number;

    @Column({type: 'decimal', precision: 10, scale: 5})
    USD?: number;
}