package com.multicore.crm.service;

import com.multicore.crm.dto.analytics.RevenueStatsDTO;
import com.multicore.crm.dto.analytics.SalesFunnelDTO;
import com.multicore.crm.entity.Deal;
import com.multicore.crm.repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SalesAnalyticsServiceImpl implements SalesAnalyticsService {

    private final DealRepository dealRepository;

    @Override
    public SalesFunnelDTO getSalesFunnel(Long businessId) {
        List<Deal> deals = dealRepository.findByBusinessId(businessId);

        long prospect = deals.stream().filter(d -> d.getStage() == Deal.Stage.PROSPECT).count();
        long negotiation = deals.stream().filter(d -> d.getStage() == Deal.Stage.NEGOTIATION).count();
        long won = deals.stream().filter(d -> d.getStage() == Deal.Stage.WON).count();
        long lost = deals.stream().filter(d -> d.getStage() == Deal.Stage.LOST).count();

        return SalesFunnelDTO.builder()
                .businessId(businessId)
                .totalDeals(deals.size())
                .prospectCount(prospect)
                .negotiationCount(negotiation)
                .wonCount(won)
                .lostCount(lost)
                .build();
    }

    @Override
    public RevenueStatsDTO getRevenueStats(Long businessId) {
        List<Deal> deals = dealRepository.findByBusinessId(businessId);

        DoubleSummaryStatistics totals = deals.stream()
                .map(Deal::getAmount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .summaryStatistics();

        List<Deal> wonDeals = deals.stream()
                .filter(d -> d.getStage() == Deal.Stage.WON)
                .toList();

        List<Deal> lostDeals = deals.stream()
                .filter(d -> d.getStage() == Deal.Stage.LOST)
                .toList();

        List<Deal> openDeals = deals.stream()
                .filter(d -> d.getStage() != Deal.Stage.WON && d.getStage() != Deal.Stage.LOST)
                .toList();

        double wonAmount = sumAmounts(wonDeals);
        double lostAmount = sumAmounts(lostDeals);
        double openAmount = sumAmounts(openDeals);

        double average = deals.isEmpty() ? 0.0 : totals.getAverage();

        return RevenueStatsDTO.builder()
                .businessId(businessId)
                .totalPipelineAmount(totals.getSum())
                .openPipelineAmount(openAmount)
                .wonAmount(wonAmount)
                .lostAmount(lostAmount)
                .averageDealValue(average)
                .openDealsCount(openDeals.size())
                .wonDealsCount(wonDeals.size())
                .lostDealsCount(lostDeals.size())
                .build();
    }

    private double sumAmounts(List<Deal> deals) {
        return deals.stream()
                .map(Deal::getAmount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();
    }
}

